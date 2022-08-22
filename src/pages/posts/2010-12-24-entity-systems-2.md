---
title: EntitySystems - Part 2
date: 2014-04-18
description: ""
categories: []
tags: ["C#","EntitySystems"]
layout: "../../layouts/BlogPost.astro"
---

# Entity Systems Part 2: Components

Entities are essentially disconnected collections of components. Or as disconnected as possible. Some components depend on others to mean anything in game, but can be processed individually. We should start looking at how components are stored and associated with entities.

It's useful to think of each component type having it's own database table. Each row then is an instance of that component type. The primary key is the entity key.

Components are just data containers so there's no standard functionality across all of them. The only functionality they should contain are things like operator overloads, type conversions, or internal data manipulation (getters, setters). A few will have events to indicate that a value has crossed a threshold for example an OnDied event when int Health == 0

I've found it useful for the component to have on small bit of common functionality - the owner. My original design was an empty interface, but this didn't provide a link back to the owning entity unless the component type specified it. I added an abstract base that implemented this.

## IEntityComponent

```csharp
public interface IEntityComponent
{
    ulong Owner { get; set; }
}
```
## EntityComponent
```csharp
public abstract class EntityComponent : IEntityComponent
{
    private ulong _owner;

    public virtual ulong Owner
    {
        get
        {
            return _owner;
        }
        set
        {
            if (_owner == 0)
                _owner = value;
            else
                throw new FieldAccessException("Cannot reset component to different entity.");
        }
    }
}
```

And that's it. Just an interface so our component managers can enforce some semblance of type control.

## IComponentManager
This is really the meat of components - holding and manipulating typed collections. I use a base interface to make it easier to swap out different implementations.

```csharp
interface IComponentManager : IEnumerable<Type>
{
    void Add<T>(ulong entityId, T o) where T : EntityComponent;
    void Add(ulong id, IEnumerable components);

    void Remove(ulong id);
    bool Remove<T>(ulong id) where T : EntityComponent;

    T Get<T>(ulong id) where T : EntityComponent;

    bool Contains(ulong id, Type t);
}
```

The interface specifies the functionality to add components singly or as a list. It can remove a whole entity or a single type from an entity. Finally, it can retrieve components.

This is not meant to be a forward facing class. It's designed to be internal to the EntityManager. It provides the mechanisms for the entities to report about themselves.

## Default ComponentManager
The default ComponentManager is mostly just a wrapper for a dictionary that conforms to the interface.

```csharp
internal class ComponentManager : IComponentManager
{
    ...

    Dictionary<Type, Dictionary<ulong, EntityComponent>> _components;

    ...
}
```

## Conclusion

Everything up till now has been fairly straightforward. Things get more complicated when we start creating systems that require multiple component types. To put it in SQL terms again, how do we write a JOIN query? Well, that's for part 3.